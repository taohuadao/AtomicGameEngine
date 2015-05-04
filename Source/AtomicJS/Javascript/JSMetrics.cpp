
#include <Atomic/Container/Sort.h>

#include "JSVM.h"
#include "JSMetrics.h"

namespace Atomic
{

JSMetrics::JSMetrics(Context* context, JSVM *vm) : Object(context),
    vm_(vm)
{

}

JSMetrics::~JSMetrics()
{

}

static bool CompareObjectMetrics(const JSMetrics::ObjectMetric& lhs, const JSMetrics::ObjectMetric& rhs)
{
    return lhs.count > rhs.count;
}

void JSMetrics::Dump()
{
    Vector<ObjectMetric> sorted;

    HashMap<StringHash, ObjectMetric>::ConstIterator itr = objectMetrics_.Begin();
    while (itr != objectMetrics_.End())
    {
        sorted.Push(itr->second_);
        itr++;
    }

    Sort(sorted.Begin(), sorted.End(), CompareObjectMetrics);

    Vector<ObjectMetric>::ConstIterator vitr = sorted.Begin();
    while (vitr != sorted.End())
    {
        const String& classname = (*vitr).classname;
        LOGINFOF("%s %i", classname.CString(), objectMetrics_[classname].count);
        vitr++;
    }
}

void JSMetrics::Capture()
{
    objectMetrics_.Clear();

    HashMap<void*, RefCounted*>::ConstIterator itr = vm_->heapToObject_.Begin();
    while (itr != vm_->heapToObject_.End())
    {
        String classname = "RefCounted";
        if (itr->second_->IsObject())
        {
            classname = ((Object*) itr->second_)->GetTypeName();
        }

        if (!objectMetrics_.Contains(classname))
        {
            JSMetrics::ObjectMetric metric;
            metric.classname = classname;
            metric.count = 1;

            objectMetrics_[classname] = metric;
        }
        else
        {
            objectMetrics_[classname].count++;
        }

        itr++;
    }

}

}
